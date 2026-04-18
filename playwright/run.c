#include <stdlib.h>
#include <stdio.h>

int main() {
    // chạy node local
    int result = system("node\\node.exe dist\\app.js");

    if (result != 0) {
        printf("Failed to run Node app\n");
    }

    return 0;
}