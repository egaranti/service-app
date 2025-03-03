export const FORM_MODES = {
  NEW: "new",
  EDIT: "edit",
};

export const DEFAULT_TITLES = {
  MAIN_FORM: "SERVICE",
  FOLLOW_UP_FORM: "OPERATION",
};

export const INITIAL_FORM = {
  orderKey: "form_1",
  title: DEFAULT_TITLES.MAIN_FORM,
  parentFormId: null,
  fields: [],
};

export const INITIAL_FOLLOW_UP_FORM = {
  orderKey: "form_2",
  title: DEFAULT_TITLES.FOLLOW_UP_FORM,
  parentFormId: null,
  fields: [],
};
