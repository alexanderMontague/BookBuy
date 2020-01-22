#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

FILE *fp = NULL;
FILE *fpW = NULL;
char courseCodeArr[250][250];
char courseDescArr[250][250];
int lineCount = 0;

int main()
{
  char tempLine[250];
  fp = fopen("./UofGPrograms.txt", "r");
  fpW = fopen("./UofGJSON.txt", "w");

  while (fgets(tempLine, 512, fp) != NULL)
  {

    bool isDesc = false;
    int descIndex = 0;
    for (int i = 0; i < strlen(tempLine) + 1; i++)
    {
      if (tempLine[i] == ' ')
      {
        isDesc = true;
      }

      if (isDesc == true)
      { // get description
        courseDescArr[lineCount][descIndex] = tempLine[i + 1];
        descIndex++;
      }
      else
      { // get course code
        courseCodeArr[lineCount][i] = tempLine[i];
      }
    }
    courseDescArr[lineCount][strlen(courseDescArr[lineCount]) - 1] = '\0';
    printf("CODE: %s DESC: %s\n", courseCodeArr[lineCount], courseDescArr[lineCount]);
    fprintf(fpW, "{ label: \"%s %s\", value: \"%s\" },\n", courseCodeArr[lineCount], courseDescArr[lineCount], courseCodeArr[lineCount]);
    lineCount++;
  }

  return 0;
}