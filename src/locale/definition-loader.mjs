import { validateLocale } from "./validation.mjs";
import { reportLocaleFileFailure } from "./failure-reporting.mjs";

/** Parse and validate locale file contents. */
export const loadLocaleDefinitions = ({ files, log }) => {
  const definitions = [];
  for (const { file, content } of files) {
    try {
      const locale = JSON.parse(content);
      if (!validateLocale(locale)) {
        throw new TypeError("locale must be a flat object containing only string values");
      }
      definitions.push([file.replace(/\.json$/, ""), locale]);
    } catch (error) {
      reportLocaleFileFailure({ file, error, log });
    }
  }
  return definitions;
};
