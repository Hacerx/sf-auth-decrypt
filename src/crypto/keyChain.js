/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { keyChainImpl } from './keyChainImpl.js';
import { getBoolean } from '../utils/env.js';

/**
 * Gets the os level keychain impl.
 *
 * @param platform The os platform.
 * @ignore
 */
export const retrieveKeychain = async (platform) => {
    const useGenericUnixKeychainVar = getBoolean('SF_USE_GENERIC_UNIX_KEYCHAIN');
    const shouldUseGenericUnixKeychain = useGenericUnixKeychainVar && useGenericUnixKeychainVar;
    if (platform.startsWith('win')) {
        return keyChainImpl.generic_windows;
    } else if (platform.includes('darwin')) {
        // OSX can use the generic keychain. This is useful when running under an
        // automation user.
        if (shouldUseGenericUnixKeychain) {
            return keyChainImpl.generic_unix;
        } else {
            return keyChainImpl.darwin;
        }
    } else if (platform.includes('linux')) {
        // Use the generic keychain if specified
        if (shouldUseGenericUnixKeychain) {
            return keyChainImpl.generic_unix;
        } else {
            // otherwise try and use the builtin keychain
            try {
                await keyChainImpl.linux.validateProgram();
                return keyChainImpl.linux;
            } catch (e) {
                // If the builtin keychain is not available use generic
                return keyChainImpl.generic_unix;
            }
        }
    } else {
        throw new Error(`Unsupported Operating System: ${platform}`);
    }
};