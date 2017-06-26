module.exports = {

  // objects-related requests handling
  Objects: {
    implementationInfo: function () {
      let implementation_info =
        {
          "objects":
          {
            "messages": ["create", "show", "list"],
            "private_messages": ["create", "show", "list"],
            "threads": ["create", "show", "list"]
          },
          "options": []
        };
      return implementation_info;
    },

    messages: {
      create: function(params) {
        return "";
      },
      list: function() {
        return [];
      },
      show: function() {
        return "";
      }
    },

    private_messages: {
      create: function(params) {
        return "";
      },
      list: function() {
        return [];
      },
      show: function() {
        return "";
      }
    },

    threads: {
      create: function(params) {
        return "";
      },
      list: function() {
        return [];
      },
      show: function() {
        return "";
      }
    }
  },

  // request validation functions
  Request: {

    validation: {
      // return a hash containing the object and the action or null if action parameter is not formatted well
      parseAction: function(str) {
        // match request formatted like this: "object.action"
        var action_reg = /^(\w+)\.(\w+)$/;
        var matched = str.match(action_reg);
        if (matched) {
          let object = matched[1];
          let action = matched[2];

          return {"object": object, "action": action};
        }
        return null;
      },

      // returns true if the request is valid, false otherwise
      isValid: function(body) {
        // returns false if there is no action parameter in the request body
        if (!('action' in body))
          return false;

        // no need to go further if action is implementation.info
        if (body.action == "implementation.info")
          return true;

        // stores a hash with the object and the action
        var action_hash = this.parseAction(body.action);

        // in case action_hash is null or there is no params parameter in a create action request
        if (!action_hash || (action_hash.action === 'create' && !('params' in body)))
          return false;

        // make sure that both object AND action are valid
        return ["messages", "private_messages", "threads"].includes(action_hash.object) && ["create", "list", "show"].includes(action_hash.action);
      }
    },

    // calls the right function based on the action parameter
    process: function(body) {
      if (body.action == 'implementation.info')
        return module.exports.Objects.implementationInfo();
      else {
        var action_hash = this.validation.parseAction(body.action);

        return action_hash.action === 'create' ? module.exports.Objects[action_hash.object].create(body.params)
                                              : module.exports.Objects[action_hash.object][action_hash.action].call();
      }
    }
  }
};
