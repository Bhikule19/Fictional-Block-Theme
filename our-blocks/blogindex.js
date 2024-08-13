wp.blocks.registerBlockType("ourblocktheme/blogindex", {
  title: "Fictional Uni Blog index ",
  edit: function () {
    return wp.element.createElement(
      "div",
      { className: "our-placeholder-block" },
      "Blog Index"
    );
  },
  save: function () {
    return null;
  },
});
