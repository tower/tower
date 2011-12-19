(function() {
  var en;

  en = {
    model: {
      errors: {
        presence: "%{attribute} can't be blank",
        minimum: "%{attribute} must be a minimum of %{value}",
        maximum: "%{attribute} must be a maximum of %{value}",
        length: "%{attribute} must be equal to %{value}",
        format: "%{attribute} must be match the format %{value}",
        inclusion: "%{attribute} is not included in the list",
        exclusion: "%{attribute} is reserved",
        invalid: "%{attribute} is invalid",
        confirmation: "%{attribute} doesn't match confirmation",
        accepted: "%{attribute} must be accepted",
        empty: "%{attribute} can't be empty",
        blank: "%{attribute} can't be blank",
        tooLong: "%{attribute} is too long (maximum is %{count} characters)",
        tooShort: "%{attribute} is too short (minimum is %{count} characters)",
        wrongLength: "%{attribute} is the wrong length (should be %{count} characters)",
        taken: "%{attribute} has already been taken",
        notANumber: "%{attribute} is not a number",
        greaterThan: "%{attribute} must be greater than %{count}",
        greaterThanOrEqualTo: "%{attribute} must be greater than or equal to %{count}",
        equalTo: "%{attribute} must be equal to %{count}",
        lessThan: "%{attribute} must be less than %{count}",
        lessThanOrEqualTo: "%{attribute} must be less than or equal to %{count}",
        odd: "%{attribute} must be odd",
        even: "%{attribute} must be even",
        recordInvalid: "Validation failed: %{errors}"
      },
      fullMessages: {
        format: "%{message}"
      }
    }
  };

  Coach.Support.I18n.load(en);

  module.exports = en;

}).call(this);
