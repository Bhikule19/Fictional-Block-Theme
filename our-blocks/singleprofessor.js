wp.blocks.registerBlockType("ourblocktheme/singleprofessor", {
  title: "Single Professor ",
  edit: function () {
    return wp.element.createElement(
      "div",
      { className: "our-placeholder-block" },
      "Single Professor"
    );
  },
  save: function () {
    return null;
  },
});
