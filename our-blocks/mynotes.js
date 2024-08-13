wp.blocks.registerBlockType("ourblocktheme/mynotes", {
  title: "My Notes ",
  edit: function () {
    return wp.element.createElement(
      "div",
      { className: "our-placeholder-block" },
      "My Notes"
    );
  },
  save: function () {
    return null;
  },
});
