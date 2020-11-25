import TickTickClient from "./vendor/ticktick";

let client: TickTickClient;

async function getClient() {
  if (!client) {
    client = new TickTickClient({
      username: process.env.TICKTICK_USERNAME,
      password: process.env.TICKTICK_PASSWORD,
    });

    await client.init();
  }

  return client;
}

export async function createTask(title: string, url: string, tags: string[]) {
  const client = await getClient();
  await client.addTask({
    title,
    content: url,
    tags,
  });
}
