import { CronJob } from "quirrel/next";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { createTask } from "../todoist";
import _ from "lodash";

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

export default CronJob("github", "@daily", async () => {
  const notifications = await getAllNewNotifications();

  const uniqueNotifications = _.uniqBy(notifications, (n) => n.id);

  for (const notification of uniqueNotifications) {
    const {
      data: { html_url },
    } = await octokit.request({
      url: notification.subject.url,
    });

    await createTask(notification.subject.title, html_url);
  }
});
