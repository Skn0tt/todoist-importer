"use strict";
import request from "request";
import ObjectID from "bson-objectid";

export default class Tick {
  constructor(options) {
    /*
      options should include {
          username: "email@email.com"
          password: "user password here"
      }
    */
    this.request = request.defaults({ jar: true });
    this.options = options;
  }

  async init() {
    await this.login(this.options.username, this.options.password);
  }

  async login(username, password) {
    const url = "https://ticktick.com/api/v2/user/signon?wc=true&remember=true";

    const options = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Origin: "https://ticktick.com",
      },
      json: {
        username: username,
        password: password,
      },
    };
    await new Promise((resolve, reject) => {
      this.request(options, function (error, request, body) {
        if (body.username !== undefined) {
          resolve();
        } else {
          reject(new Error("Could not login"));
        }
      });
    });
  }

  async addTask(jsonOptions) {
    const url = "https://ticktick.com/api/v2/task";

    const options = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Origin: "https://ticktick.com",
      },
      json: {
        assignee: jsonOptions.assignee ? jsonOptions.assignee : null,
        content: jsonOptions.content ? jsonOptions.content : "",
        deleted: jsonOptions.deleted ? jsonOptions.deleted : 0,
        dueDate: jsonOptions.dueDate ? jsonOptions.dueDate : null,
        id: jsonOptions.id ? jsonOptions.id : ObjectID(),
        isAllDay: jsonOptions.isAllDay ? jsonOptions.isAllDay : null,
        isDirty: jsonOptions.isDirty ? jsonOptions.isDirty : true,
        items: jsonOptions.items ? jsonOptions.items : [],
        local: jsonOptions.local ? jsonOptions.local : true,
        modifiedTime: jsonOptions.modifiedTime
          ? jsonOptions.modifiedTime
          : new Date().toISOString().replace("Z", "+0000"), //"2017-08-12T17:04:51.982+0000",
        priority: jsonOptions.priority ? jsonOptions.priority : 0,
        progress: jsonOptions.progress ? jsonOptions.progress : 0,
        projectId: jsonOptions.projectId ? jsonOptions.projectId : this.inboxId,
        reminder: jsonOptions.reminder ? jsonOptions.reminder : null,
        reminders: jsonOptions.reminders
          ? jsonOptions.reminders
          : [{ id: ObjectID(), trigger: "TRIGGER:PT0S" }],
        remindTime: jsonOptions.remindTime ? jsonOptions.remindTime : null,
        repeatFlag: jsonOptions.repeatFlag ? jsonOptions.repeatFlag : null,
        sortOrder: jsonOptions.sortOrder
          ? jsonOptions.sortOrder
          : this.sortOrder,
        startDate: jsonOptions.startDate ? jsonOptions.startDate : null,
        status: jsonOptions.status ? jsonOptions.status : 0,
        tags: jsonOptions.tags ? jsonOptions.tags : [],
        timeZone: jsonOptions.timeZone
          ? jsonOptions.timeZone
          : "America/New_York", // This needs to be updated to grab dynamically
        title: jsonOptions.title,
      },
    };

    await new Promise((resolve, reject) => {
      this.request(options, function (error, response, body) {
        resolve(body);
      });
    });
  }
}
