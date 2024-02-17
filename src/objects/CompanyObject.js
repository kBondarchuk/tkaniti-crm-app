const _paymentSettingsItem = {
  settings_id: null,
  ofd_settings_id: null,
};

const _companyObject = {
  id: null,
  name: "",
  details: "",
  bank_details: "",
  notes: "",

  payments: {
    settings: {
      order: {
        acq: Object.assign({}, _paymentSettingsItem),
        sbp: Object.assign({}, _paymentSettingsItem),
      },
    },
  },
};

export default _companyObject;
