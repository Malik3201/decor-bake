export const softDeletePlugin = (schema) => {
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  });

  schema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  schema.pre(/^find/, function () {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: false });
    }
  });
};

