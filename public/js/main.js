/* eslint-env jquery, browser */
$(document).ready(() => {

  // Place JavaScript code here...
  class Message {
      constructor(type) {
          this.type = type;
      }

      toJSON() {
          return {type: this.type};
      }
  }

  class SessionCreate extends Message {
      constructor(owner) {
          super("sessioncreate");
          this.owner = owner;
      }

      toJSON() {
          const s = super.toJSON();
          s["owner"] = this.owner;
          return s;
      }
  }

  class UserCreate extends Message {
      constructor(user) {
          super("usercreate");
          this.user = user;
      }

      toJSON() {
          const s = super.toJSON();
          s["user"] = this.user;
          return s;
      }
  }

  class UserJoin extends Message {
      constructor(user, sessionid) {
          super("userjoin");
          this.user = user;
          this.sessionid = sessionid;
      }

      toJSON() {
          const s = super.toJSON();
          s["user"] = this.user;
          s["sessionid"] = this.sessionid;
          return s;
      }
  }

});
