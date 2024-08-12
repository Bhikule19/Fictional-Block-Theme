wp.blocks.registerBlockType("ourblocktheme/footer", {
  title: "Custom Block Footer ",
  edit: function () {
    return wp.element.createElement(
      "div",
      { className: "our-placeholder-block" },
      "Footer Placeholder"
    );
  },
  save: function () {
    return null;
  },
});
