import fs from 'fs'
import os from 'os'
import * as core from '@actions/core'
import * as io from '@actions/io'
import * as cache from '@actions/cache'
import * as coursier from '../modules/coursier'
import * as mill from '../modules/mill'
import {type Logger} from '../core/logger'
import {Workspace} from '../modules/workspace'
import {type Files} from '../core/files'

/**
 * Saves caches and performs a cleanup of all the tools/folders
 * created by this action.
 */
async function run(): Promise<void> {
  try {
    const logger: Logger = core
    const files: Files = {...fs, ...io}
    const workspace = Workspace.from(logger, files, os, cache)

    await coursier.saveCache(workspace.reposHash())
    await workspace.saveWorkspaceCache()

    await workspace.remove()
    core.info('🗑 Scala Steward\'s workspace removed')

    await coursier.remove()
    core.info('🗑 Coursier binary removed')

    await mill.remove()
    core.info('🗑 Mill binary removed')
  } catch (error: unknown) {
    core.warning((error as Error).message)
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void run()