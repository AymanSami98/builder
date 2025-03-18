/** @format */

$(function () {
  var form = $("form#sig");
  var output = $("#sig-output");

  var regions = {
    europe: {
      twitter: "https://twitter.com/togetherall",
      linkedin: "https://www.linkedin.com/company/together-all",
    },
    "north-america": {
      twitter: "https://twitter.com/togetherallna",
      linkedin: "https://www.linkedin.com/company/togetherall-northamerica",
    },
    oceania: {
      twitter: "https://twitter.com/togetherall",
      linkedin: "https://www.linkedin.com/company/together-all",
    },
  };

  var banners = {
    standard: {
      image: "http://bunkercreative.co.uk/signatures/nourish/images/banner.png",
      alt: "Nourish Care",
      url: "https://www.nourishcare.com/",
    },
    "care-show-london": {
      image: "http://bunkercreative.co.uk/signatures/nourish/images/care-show-london.png",
      alt: "Care Show London",
      url: "https://www.careshowlondon.co.uk/",
    },
    "example": {
      image: "https://img.freepik.com/premium-photo/wooden-cubes-with-word-example_284815-518.jpg",
      alt: "Example",
      url: "https://www.example.co.uk/",
    },
    "uk-care-week": {
      image: "http://bunkercreative.co.uk/signatures/nourish/images/banner-uk-care-week.png",
      alt: "UK Care Week",
      url: "https://www.ukcareweek.com/",
    },
  };

  var noticeText = {
    en: "<strong>Notice to recipient</strong> - This message and its attachments are private and confidential. If you have received this message in error, you should not copy it or show it to anyone, nor take any action based on its contents. Instead, reply to this message and let the sender know you have received this in error. Then, delete this email from your system. Thank you.",
    "fr-ca":
      "<strong>Avis au destinataire</strong> – Ce message et les pièces jointes qu’il contient sont privés et confidentiels. Si vous avez reçu ce message par erreur, vous ne devez pas le copier, le montrer à quiconque, ni prendre aucune action basée sur son contenu. Répondez plutôt au message afin d’aviser l’expéditeur que vous avez reçu ce message par erreur, puis supprimez ce message de votre système. Merci.",
  };

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  let socialMediaIcons;

  // Show the default design.
  showDesign();

  form.on("submit", function (evt) {
    evt.preventDefault();

    $("#submit")
      .html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' +
          '<span class="visually-hidden">Generating...</span>'
      )
      .attr("disabled", true);

    removeUnusedFields();

    window.setTimeout(function () {
      $("html").html($("#sig-output").html());
    }, randomIntFromInterval(1000, 5000));
  });

  form.find("input").on("keyup", handleInputChange);
  form.find("select").on("change", handleInputChange);
  form.find('input[type="checkbox"]').on("change", handleInputChange);

  function handleInputChange() {
    // Any checkboxes need to be reset.
    let bigWhiteWallText = false;
    let showSocialMediaIcons = false;

    // Loop through the form data.
    form.serializeArray().forEach(function (item) {
      // Find the element with the name attribute.
      var element = $("#sig-output").find('[data-name="' + item.name + '"]');

      // Set the value of the element.
      element.html(item.value);

      switch (item.name) {
        case "email":
          updateEmail(item.value, element);
          break;
        case "region":
          updateRegion(item.value, element);
          break;
        case "custom-line-link":
          updateCustomLineLink(item.value);
          break;
        case "additional-banner":
          updateBanner(item.value);
          break;
          case "image-link": // Handle custom link for the image
        updateImageLink(item.value);
        break;
        case "divider-color": 
        updateDividerColor(item.value);
        break;
        case  "signature-image":
      updateSignatureImage(item.value);
      break;

      }

      // Hide the entire generated field if it has no value.

      if (item.value === "") {
        $(".table-" + item.name).hide();
      } else {
        $(".table-" + item.name).show();
      }
    });

    // Update checkboxes.
    updateSocialMediaIcons(showSocialMediaIcons);
  }

  /**
   * Function to initially show the
   * email design in the preview box.
   *
   * @param {*} form
   */
  function showDesign() {
    $.get("designs/default.html", function (data) {
      var html = $(data);

      $("#sig-output").html(html);
    });
  }

  /**
   * Updates the href and title attributes
   * of the email element.
   *
   * @param {string} address
   * @param {JQuery} element
   */
  function updateEmail(address, element) {
    element.attr("href", "mailto:" + address);
    element.attr("title", address);
  }

  /**
   * Update specific elements based on the region.
   *
   * @param {*} region
   * @param {*} element
   */
  function updateRegion(region, element) {
    output.find("#twitter-link").attr("href", regions[region]["twitter"]);
    output.find("#linkedin-link").attr("href", regions[region]["linkedin"]);
  }

  function updateCustomLineLink(link) {
    if (link === "") {
      output.find("#custom-line-link").removeAttr("href");
    } else {
      output.find("#custom-line-link").attr("href", link);
    }
  }
  function updateDividerColor(color) {
    $("#sig-output .divider_inner").css("border-top-color", color);
  }
  function updateImageLink(link) {
    if (link.trim() === "") {
      $("#dynamic-link").attr("href", "#"); // Default empty link
    } else {
      // Ensure the link has a proper protocol
      if (!link.startsWith("http://") && !link.startsWith("https://")) {
        link = "https://" + link; // Prepend HTTPS if missing
      }
      $("#dynamic-link").attr("href", link);
    }
  }
  

  /**
   * Show or hide the social media icons.
   *
   * @param {*} value
   */
  function updateSocialMediaIcons(value) {
    if (value) {
      output.find(`#socal-media`).show();
    } else {
      output.find(`#socal-media`).hide();
    }
  }

  /**
   * Updated banner image.
   *
   * @param {*} value
   */
  function updateBanner(value) {
    if (value === "none") {
      output.find(`#additional-banner`).hide();
    } else {
      output.find(`#additional-banner`).show();
      output.find(`#additional-banner`).attr("src", banners[value]["image"]);
      output.find(`#additional-banner`).attr("alt", banners[value]["alt"]);
      output.find(`#additional-banner-link`).attr("href", banners[value]["url"]);
    }
  }

  /**
   * Generates a random number between 2 integers.
   * @param {number} min
   * @param {number} max
   * @returns
   */
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Removes the table elements from the generated
   * signature if the form field is empty.
   */
  function removeUnusedFields() {
    // Any checkboxes need to be reset.
    let showSocialMediaIcons = false;

    // Loop through the form data.
    form.serializeArray().forEach(function (item) {
      if (item.value === "" || item.value === "none") {
        $("#sig-output")
          .find(".table-" + item.name)
          .remove();
      }

      if (item.name == "show-social-media-icons") {
        showSocialMediaIcons = true;
      }
    });

    // If the checkbox is not checked, remove the elements.
    if (!showSocialMediaIcons) {
      $("#sig-output").find("#socal-media").remove();
    }
  }
});

function updateSignatureImage(selectedImage) {
  let images = {
    image1: {
      src: "https://i.ibb.co/bjdwWGQD/BC5585-ALTUM-GROUP-Email-Group-Template-Banners-01.jpg",
      alt: "Banner 1",
    },
    image2: {
      src: "https://i.ibb.co/PG3cTHpk/BC5585-ALTUM-GROUP-Email-Group-Template-Banners-03.jpg",
      alt: "Banner 2",
    },
    image3: {
      src: "https://i.ibb.co/vCgLGSc2/BC5585-ALTUM-GROUP-Email-Group-Template-Banners-02.jpg",
      alt: "Banner 3",
    },
  };

  if (selectedImage === "none") {
    $("#signature-image-preview").hide(); // Hide only this image
  } else {
    let selected = images[selectedImage];

    if (selected) {
      $("#signature-image-preview")
        .attr("src", selected.src)
        .attr("alt", selected.alt)
        .show();
    }
  }
}

// Listen for changes in the dropdown selection
$("#signature-image").on("change", function () {
  updateSignatureImage(this.value);
});
