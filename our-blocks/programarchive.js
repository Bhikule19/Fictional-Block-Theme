wp.blocks.registerBlockType("ourblocktheme/programarchive", {
  title: "Program Archive ",
  edit: function () {
    return wp.element.createElement(
      "div",
      { className: "our-placeholder-block" },
      "Program Archive"
    );
  },
  save: function () {
    return null;
  },
});
