import { Directory } from "expo-file-system/next";

export const FS = {
  /**
   * Create a directory.
   *
   * Only create missing directory in the chain.
   *
   * @param directory
   */
  createDirectoryRecursively: (directory: Directory) => {
    const stack: Directory[] = [];

    // Traverse up to find the first existing parent directory
    let current: Directory | null = directory;
    while (current && !current.exists) {
      stack.push(current);
      current = current.parentDirectory;
    }

    // Create directories from the first non-existing parent down to the target directory
    while (stack.length > 0) {
      const dir = stack.pop();
      if (dir) {
        dir.create();
      }
    }
  },
  /**
   * Delete a directory and its content
   *
   * @param directory
   * @param __do_not_use_internal__isRecursiveCall -- Do not used, internal parameter
   * @returns
   */
  deleteDirectoryContentRecursively: (
    directory: Directory,
    __do_not_use_internal__isRecursiveCall = false
  ) => {
    if (!directory.exists)
      return console.log(`Directory ${directory.uri} does not exist`);

    const contents = directory.list();

    for (const item of contents) {
      if (item instanceof Directory) {
        FS.deleteDirectoryContentRecursively(item, true);
        item.delete();
      } else {
        item.delete();
      }
    }

    // Forced to do that, because the API marked synchronous but seems not ?
    directory.exists &&
      !__do_not_use_internal__isRecursiveCall &&
      directory.delete();
  },
  /**
   * Print the directory in the console for debugging purposes.
   * @param directory
   * @param indent
   * @returns
   */
  printDirectory(
    directory: Directory,
    indent = 0,
    intoConsole = true,
    isNested = false
  ) {
    if (!directory.exists) return { lines: [], total: 0, count: 0 };
    let totalSize = 0;
    let fileCount = 0;
    const lines: string[] = [];

    lines.push(`${" ".repeat(indent)} + ${directory.name}`);
    const contents = directory.list();
    for (const item of contents) {
      if (item instanceof Directory) {
        const {
          lines: nestedLines,
          total,
          count,
        } = FS.printDirectory(item, indent + 2, intoConsole, true);
        lines.push(...nestedLines);
        totalSize += total;
        fileCount += count;
      } else {
        const size = item.size ? item.size : 0;
        totalSize += size;
        fileCount += 1;
        lines.push(
          `${" ".repeat(indent + 2)} - ${item.name} (${size.toFixed(2)} kB)`
        );
      }
    }

    if (indent === 0) {
      const averageSize = fileCount > 0 ? totalSize / fileCount : 0;
      lines.push(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
      lines.push(`Average file size: ${(averageSize / 1024).toFixed(2)} kB`);
    }

    if (intoConsole && !isNested) {
      for (const line of lines) {
        console.log(line);
      }
    }

    return { lines, total: totalSize, count: fileCount };
  },
};
