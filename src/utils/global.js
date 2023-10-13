/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import os from 'os';
import { join } from 'path';
import { promises } from 'fs';
import { getBoolean } from './env.js';

// exports.Global = exports.Mode = void 0; // eslint-disable-line
/**
 * Represents an environment mode.  Supports `production`, `development`, `demo`, and `test`
 * with the default mode being `production`.
 *
 * To set the mode, `export SFDX_ENV=<mode>` in your current environment.
 */
// let Mode;
// (function (Mode) {
//     Mode.PRODUCTION = 'production';
//     Mode.DEVELOPMENT = 'development';
//     Mode.DEMO = 'demo';
//     Mode.TEST = 'test';
// })((exports.Mode = {}));
/**
 * Global constants, methods, and configuration.
 */
export class Global {
    /**
     * The full system path to the global sfdx state folder.
     *
     * **See** {@link Global.SFDX_STATE_FOLDER}
     */
    static get SFDX_DIR () {
        return join(os.homedir(), Global.SFDX_STATE_FOLDER);
    }

    /**
     * The full system path to the global sf state folder.
     *
     * **See**  {@link Global.SF_STATE_FOLDER}
     */
    static get SF_DIR () {
        return join(os.homedir(), Global.SF_STATE_FOLDER);
    }

    /**
     * The full system path to the preferred global state folder
     */
    static get DIR () {
        return join(os.homedir(), Global.SFDX_STATE_FOLDER);
    }

    /**
     * Gets the current mode environment variable as a {@link Mode} instance.
     *
     * ```
     * console.log(Global.getEnvironmentMode() === Mode.PRODUCTION);
     * ```
     */
    // static getEnvironmentMode () {
    //     return Mode[getKeyOf('SFDX_ENV', Mode, Mode.PRODUCTION, (value) => value.toUpperCase())];
    // }

    /**
     * Creates a directory within {@link Global.SFDX_DIR}, or {@link Global.SFDX_DIR} itself if the `dirPath` param
     * is not provided. This is resolved or rejected when the directory creation operation has completed.
     *
     * @param dirPath The directory path to be created within {@link Global.SFDX_DIR}.
     */
    static async createDir (dirPath) {
        dirPath = dirPath ? join(Global.SFDX_DIR, dirPath) : Global.SFDX_DIR;
        try {
            if (process.platform === 'win32') {
                await promises.mkdir(dirPath, { recursive: true });
            } else {
                await promises.mkdirb(dirPath, { recursive: true, mode: 0o700 });
            }
        } catch (error) {
            console.error(`Failed to create directory or set permissions for: ${dirPath}`);
        }
    }
}
// exports.Global = Global;
/**
 * Enable interoperability between `.sfdx` and `.sf`.
 *
 * When @salesforce/core@v2 is deprecated and no longer used, this can be removed.
 */
Global.SFDX_INTEROPERABILITY = getBoolean('SF_SFDX_INTEROPERABILITY', true);
/**
 * The global folder in which sfdx state is stored.
 */
Global.SFDX_STATE_FOLDER = '.sfdx';
/**
 * The global folder in which sf state is stored.
 */
Global.SF_STATE_FOLDER = '.sf';
/**
 * The preferred global folder in which state is stored.
 */
Global.STATE_FOLDER = Global.SFDX_STATE_FOLDER;
// # sourceMappingURL=global.js.map
