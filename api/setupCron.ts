import github from "./github";

export default async function setupCron(req, res) {
  await github.enqueue(undefined, {
    id: "github",
    override: true,
    repeat: {
      cron: "@daily",
    },
  });

  res.status(200).end()
}
