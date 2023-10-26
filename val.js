module.exports = {
  val: {
    valBol: (bol) => {
      const bolRegex = /^\d{10}$/;
      return bolRegex.test(bol);
    },
    valApellidos: (ap) => {
      const apRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      return apRegex.test(ap);
    },
  },
};
