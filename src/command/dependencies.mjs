import { existsSync, readFileSync, readdirSync } from "fs";

export const createCommandDependencies = ({ fsLib, importFn } = {}) => ({
  fsLib: fsLib === undefined ? { readdirSync, readFileSync, existsSync } : fsLib,
  importFn: importFn === undefined ? (url) => import(url) : importFn,
});
