#!/usr/bin/env node
import { cli } from './cli.js';
import process from 'process';

cli(process.argv).catch((err) => console.error(err));