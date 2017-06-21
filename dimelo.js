module.exports = {
  implementation_info: {
    handle: function () {
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
    }
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
};
