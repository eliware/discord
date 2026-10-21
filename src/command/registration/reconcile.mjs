const matchesCommand = (existing, definition) =>
  existing.name === definition.name && (existing.type ?? 1) === (definition.type ?? 1);

export const reconcileCommands = async ({ commandDefs, existingCommands, request }) => {
  for (const commandDef of commandDefs) {
    const existing = existingCommands.find((command) => matchesCommand(command, commandDef));
    if (existing) await request.updateCommand(existing.id, commandDef);
    else await request.createCommand(commandDef);
  }
};
