/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import crypto from 'crypto';
import os from 'os';
import { Global } from '../utils/global.js';
import { Cache } from '../utils/cache.js';
import { retrieveKeychain } from './keyChain.js';
import { SecureBuffer } from './secureBuffer.js';
import { getBoolean } from '../utils/env.js';

// exports.Crypto = void 0;
const TAG_DELIMITER = ':';
const BYTE_COUNT_FOR_IV = 6;
const ALGO = 'aes-256-gcm';
const AUTH_TAG_LENGTH = 32;
const ENCRYPTED_CHARS = /[a-f0-9]/;
const KEY_NAME = 'sfdx';
const ACCOUNT = 'local';
const messages = new Map([['invalidEncryptedFormatError', 'The encrypted data is not properly formatted.'], ['invalidEncryptedFormatError.actions', ['If attempting to create a scratch org then re-authorize. Otherwise create a new scratch org.']], ['authDecryptError', 'Failed to decipher auth data. reason: %s.'], ['unsupportedOperatingSystemError', 'Unsupported Operating System: %s'], ['missingCredentialProgramError', 'Unable to find required security software: %s'], ['credentialProgramAccessError', 'Unable to execute security software: %s'], ['passwordRetryError', 'Failed to get the password after %i retries.'], ['passwordRequiredError', 'A password is required.'], ['keyChainServiceRequiredError', 'Unable to get or set a keychain value without a service name.'], ['keyChainAccountRequiredError', 'Unable to get or set a keychain value without an account name.'], ['keyChainUserCanceledError', 'User canceled authentication.'], ['keychainPasswordCreationError', 'Failed to create a password in the keychain.'], ['genericKeychainServiceError', 'The service and account specified in %s do not match the version of the toolbelt.'], ['genericKeychainServiceError.actions', ['Check your toolbelt version and re-auth.']], ['genericKeychainInvalidPermsError', 'Invalid file permissions for secret file'], ['genericKeychainInvalidPermsError.actions', ['Ensure the file %s has the file permission octal value of %s.']], ['passwordNotFoundError', 'Could not find password.\n%s'], ['passwordNotFoundError.actions', ['Ensure a valid password is returned with the following command: [%s]']], ['setCredentialError', 'Command failed with response:\n%s'], ['setCredentialError.actions', ['Determine why this command failed to set an encryption key for user %s: [%s].']], ['macKeychainOutOfSync', 'We\u2019ve encountered an error with the Mac keychain being out of sync with your `sfdx` credentials. To fix the problem, sync your credentials by authenticating into your org again using the auth commands.']]);
const makeSecureBuffer = (password) => {
    const newSb = new SecureBuffer();
    newSb.consume(Buffer.from(password, 'utf8'));
    return newSb;
};
/**
 * osxKeyChain promise wrapper.
 */
const keychainPromises = {
    /**
     * Gets a password item.
     *
     * @param _keychain
     * @param service The keychain service name.
     * @param account The keychain account name.
     */
    getPassword (_keychain, service, account) {
        const cacheKey = `${Global.DIR}:${service}:${account}`;
        const sb = Cache.get(cacheKey);
        if (!sb) {
            return new Promise((resolve, reject) => _keychain.getPassword({ service, account }, (err, password) => {
                if (err) { return reject(err); }
                Cache.set(cacheKey, makeSecureBuffer(password));
                return resolve({ username: account, password });
            }));
        } else {
            const pw = sb.value((buffer) => buffer.toString('utf8'));
            Cache.set(cacheKey, makeSecureBuffer(pw));
            return new Promise((resolve) => resolve({ username: account, password: pw }));
        }
    },
    /**
     * Sets a generic password item in OSX keychain.
     *
     * @param _keychain
     * @param service The keychain service name.
     * @param account The keychain account name.
     * @param password The password for the keychain item.
     */
    setPassword (_keychain, service, account, password) {
        return new Promise((resolve, reject) => _keychain.setPassword({ service, account, password }, (err) => {
            if (err) { return reject(err); }
            return resolve({ username: account, password });
        }));
    }
};
/**
 * Class for managing encrypting and decrypting private auth information.
 */
export class Crypto {
    /**
     * Constructor
     * **Do not directly construct instances of this class -- use {@link Crypto.create} instead.**
     *
     * @param options The options for the class instance.
     * @ignore
     */
    constructor (options) {
        this.key = new SecureBuffer();
        this.options = options ?? {};
    }

    decrypt (text) {
        if (text == null) {
            return;
        }
        const tokens = text.split(TAG_DELIMITER);
        if (tokens.length !== 2) {
            throw messages.createError('invalidEncryptedFormatError');
        }
        const tag = tokens[1];
        const iv = tokens[0].substring(0, BYTE_COUNT_FOR_IV * 2);
        const secret = tokens[0].substring(BYTE_COUNT_FOR_IV * 2, tokens[0].length);
        return this.key.value((buffer) => {
            const decipher = crypto.createDecipheriv(ALGO, buffer.toString('utf8'), iv);
            let dec;
            try {
                decipher.setAuthTag(Buffer.from(tag, 'hex'));
                dec = decipher.update(secret, 'hex', 'utf8');
                dec += decipher.final('utf8');
            } catch (err) {
                const error = messages.createError('authDecryptError', [err.message], [], err);
                const useGenericUnixKeychain = getBoolean('SF_USE_GENERIC_UNIX_KEYCHAIN') || getBoolean('USE_GENERIC_UNIX_KEYCHAIN');
                if (os.platform() === 'darwin' && !useGenericUnixKeychain) {
                    error.actions = [messages.getMessage('macKeychainOutOfSync')];
                }
                throw error;
            }
            return dec;
        });
    }

    decryptJson (obj){
        const decrypted = JSON.parse(JSON.stringify(obj));
        Object.entries(decrypted).forEach(([key, value]) => {
            if(this.isEncrypted(value)){
                decrypted[key] = this.decrypt(value);
            }
        });
        return decrypted;
    }

    /**
     * Takes a best guess if the value provided was encrypted by {@link Crypto.encrypt} by
     * checking the delimiter, tag length, and valid characters.
     *
     * @param text The text
     * @returns true if the text is encrypted, false otherwise.
     */
    // eslint-disable-next-line class-methods-use-this
    isEncrypted (text) {
        if (text == null || typeof text !== 'string') {
            return false;
        }
        const tokens = text.split(TAG_DELIMITER);
        if (tokens.length !== 2) {
            return false;
        }
        const tag = tokens[1];
        const value = tokens[0];
        return (tag.length === AUTH_TAG_LENGTH &&
            value.length >= BYTE_COUNT_FOR_IV &&
            ENCRYPTED_CHARS.test(tag) &&
            ENCRYPTED_CHARS.test(tokens[0]));
    }

    /**
     * Clears the crypto state. This should be called in a finally block.
     */
    close () {
        if (!this.noResetOnClose) {
            this.key.clear();
        }
    }

    /**
     * Initialize async components.
     */
    async init () {
        if (!this.options.platform) {
            this.options.platform = os.platform();
        }
        // console.error(`retryStatus: ${this.options.retryStatus}`);
        this.noResetOnClose = !!this.options.noResetOnClose;
        try {
            this.key.consume(Buffer.from((await keychainPromises.getPassword(await this.getKeyChain(this.options.platform), KEY_NAME, ACCOUNT))
                .password, 'utf8'));
        } catch (err) {
            // No password found
            if (err.name === 'PasswordNotFoundError') {
                // If we already tried to create a new key then bail.
                if (this.options.retryStatus === 'KEY_SET') {
                    console.error('a key was set but the retry to get the password failed.');
                    throw err;
                } else {
                    console.error('password not found in keychain attempting to created one and re-init.');
                }
                const key = crypto.randomBytes(Math.ceil(16)).toString('hex');
                // Create a new password in the KeyChain.
                await keychainPromises.setPassword(this.options.keychain, KEY_NAME, ACCOUNT, key);
                return this.init();
            } else {
                throw err;
            }
        }
    }

    async getKeyChain (platform) {
        if (!this.options.keychain) {
            this.options.keychain = await retrieveKeychain(platform);
        }
        return this.options.keychain;
    }
}
