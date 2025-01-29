import { FS } from "@/FS";
import { Directory, File, Paths } from "expo-file-system/next";
import { Button, Platform, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="GO"
        onPress={async () => {
          try {
            console.log("----");
            console.log("Creating directories and files");
            const root = new Directory(Paths.cache, "some");
            const inside = new Directory(root, "inside", "nested");

            FS.createDirectoryRecursively(inside);

            const file = new File(inside, "file.txt");
            file.write("Hello, World!");

            console.log("--> Content:");
            FS.printDirectory(root);

            console.log("Now delete root dir");
            root.delete();
            console.log(
              `[${Platform.OS}] Root exists after ? [${root.exists}]`
            );
            console.log("--> Content:");
            FS.deleteDirectoryContentRecursively(root);
            FS.printDirectory(root); // As you can see, it shows that "some" exists

            // For debuggers
            // Try calling root.exists and then root.delete() -> root.delete() throws that it doesn't exists !!! WTF
            // Try calling root.exists and then root.delete() -> root.delete() throws that it doesn't exists !!! WTF
            // Try calling root.exists and then root.delete() -> root.delete() throws that it doesn't exists !!! WTF
            // Try calling root.exists and then root.delete() -> root.delete() throws that it doesn't exists !!! WTF
            // Try calling root.exists and then root.delete() -> root.delete() throws that it doesn't exists !!! WTF

            console.log(
              `[${Platform.OS}] Root exists CustomDelete ? [${
                root.exists
              }] but root content length ${root.list().length}`
            );
          } catch (e) {
            console.warn(e);
          }
        }}
      />
    </View>
  );
}
