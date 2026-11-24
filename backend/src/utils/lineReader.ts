export function createLineReader(
  onLine: (line: string) => void
) {
  let buffer = "";

  return (chunk: string) => {
    buffer += chunk;

    const lines = buffer.split(/\r?\n/);

    buffer = lines.pop() ?? "";

    for (const line of lines) {
      onLine(line.trim());
    }
  };
}