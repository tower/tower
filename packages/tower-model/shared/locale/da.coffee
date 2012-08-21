Tower.SupportI18n.load module.exports =
  model:
    errors:
      presence:             "%{attribute} må ikke være blank"
      minimum:              "%{attribute} må mindst være %{value}"
      maximum:              "%{attribute} må højst være %{value}"
      length:               "%{attribute} skal være præcis %{value}"
      format:               "%{attribute} skal matche formatet %{value}"
      inclusion:            "%{attribute} er ikke inkluderet i listen"
      exclusion:            "%{attribute} er reserveret"
      invalid:              "%{attribute} er invalid"
      confirmation:         "%{attribute} stemmer ikke overens"
      accepted:             "%{attribute} skal være accepteret"
      empty:                "%{attribute} må ikke være tom"
      blank:                "%{attribute} må ikke være blank"
      tooLong:              "%{attribute} er for lang (maximum er %{count} karakterer)"
      tooShort:             "%{attribute} is for kort (minimum er %{count} karakterer)"
      wrongLength:          "%{attribute} er forkert længde (skal være %{count} karakterer)"
      taken:                "%{attribute} er allerede taget"
      notANumber:           "%{attribute} er ikke et tal"
      greaterThan:          "%{attribute} skal være større end %{count}"
      greaterThanOrEqualTo: "%{attribute} skal være større eller lig med %{count}"
      equalTo:              "%{attribute} skal være lig med %{count}"
      lessThan:             "%{attribute} skal være mindre end %{count}"
      lessThanOrEqualTo:    "%{attribute} skal være mindre eller lig med %{count}"
      odd:                  "%{attribute} skal være ulige"
      even:                 "%{attribute} skal være lige"
      recordInvalid:        "Validering fejlede: %{errors}"
      # Append your own errors here or at the model/attributes scope.
    fullMessages:
      format:               "%{message}"
      #format:              "%{attribute} %{message}"

