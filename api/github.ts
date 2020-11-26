import { Queue } from "@quirrel/next";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { createTask } from "../ticktick";

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

function getYesterday(now = Date.now()) {
  return new Date(now - 24 * 60 * 60 * 1000);
}

async function getAllNewNotifications() {
  const result: RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"] = [];

  let page = 0;
  while (true) {
    const notifications = await octokit.activity.listNotificationsForAuthenticatedUser(
      {
        participating: true,
        since: getYesterday().toISOString(),
        per_page: 100,
        page,
      }
    );

    if (notifications.data.length === 0) {
      return result;
    }

    result.push(...notifications.data);
    page++;
  }
}

export default Queue("github", async () => {
  const notifications = await getAllNewNotifications();

  for (const notification of notifications) {
    await createTask(notification.subject.title, notification.url, [
      "github",
      notification.repository.full_name,
      notification.subject.type
    ]);
  }
});
