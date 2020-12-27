import axios from "axios";
import * as uuid from "uuid";

export async function createTask(title: string, url: string) {
  console.log("Creating task: ", { title, url });
  await axios.post("https://api.todoist.com/sync/v8/sync", {
    token: process.env.TODOIST_TOKEN,
    commands: JSON.stringify([
      {
        type: "item_add",
        temp_id: uuid.v4(),
        uuid: uuid.v4(),
        args: {
          content: title + " " + url,
          project_id: process.env.TODOIST_PROJECT_ID,
        },
      },
    ]),
  });
}
