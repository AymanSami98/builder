$(function () {

    var form = $('form#sig');
    var output = $('#sig-output');

    var regions = {
        'europe': {
            'twitter': 'https://twitter.com/togetherall',
            'linkedin': 'https://www.linkedin.com/company/together-all',
        },
        'north-america': {
            'twitter': 'https://twitter.com/togetherallna',
            'linkedin': 'https://www.linkedin.com/company/togetherall-northamerica',
        },
        'oceania': {
            'twitter': 'https://twitter.com/togetherall',
            'linkedin': 'https://www.linkedin.com/company/together-all',
        },
    }

    var banners = {
        'standard-english': {
            image: 'https://bunkercreative.co.uk/signatures/togetherall/media/togetherall-email-banner-2x.jpg',
            alt: 'Togetherall - The power of community.'
        },
        'standard-french-canadian': {
            image: 'https://i.ibb.co/LhDrrhkX/BC5585-ALTUM-GROUP-Email-Group-Template-Banners-03.jpg',
            alt: 'Togetherall - Le pouvoir de la communauté.'
        },
        'trained-peers': {
            image: 'https://bunkercreative.co.uk/signatures/togetherall/media/BC4026_TOGETHERALL_Email_Sig_Banner_Trained_Peer_V3.png',
            alt: 'Togetherall - The power of community. Trained Peer'
        }
    }

    var noticeText = {
        'en': '<strong>Notice to recipient</strong> - This message and its attachments are private and confidential. If you have received this message in error, you should not copy it or show it to anyone, nor take any action based on its contents. Instead, reply to this message and let the sender know you have received this in error. Then, delete this email from your system. Thank you.',
        'fr-ca': '<strong>Avis au destinataire</strong> – Ce message et les pièces jointes qu’il contient sont privés et confidentiels. Si vous avez reçu ce message par erreur, vous ne devez pas le copier, le montrer à quiconque, ni prendre aucune action basée sur son contenu. Répondez plutôt au message afin d’aviser l’expéditeur que vous avez reçu ce message par erreur, puis supprimez ce message de votre système. Merci.'
    }

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    let socialMediaIcons;

    // Show the default design.
    showDesign();

    form.on('submit', function (evt) {
        evt.preventDefault();

        $('#submit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' +
            '<span class="visually-hidden">Generating...</span>').attr('disabled', true);

        removeUnusedFields();

        window.setTimeout(function () {
            $('html').html($('#sig-output').html());
        }, randomIntFromInterval(1000, 5000));

    });

    form.find('input').on('keyup', handleInputChange);
    form.find('select').on('change', handleInputChange);
    form.find('input[type="checkbox"]').on('change', handleInputChange);

    function handleInputChange() {

        // Any checkboxes need to be reset.
        let bigWhiteWallText = false;
        let showSocialMediaIcons = false;

        // Loop through the form data.
        form.serializeArray().forEach(function (item) {

            // Find the element with the name attribute.
            var element = $('#sig-output').find('[data-name="' + item.name + '"]');

            // Set the value of the element.
            element.html(item.value);

            switch (item.name) {
                case 'email':
                    updateEmail(item.value, element);
                    break;
                case 'region':
                    updateRegion(item.value, element);
                    break;
                case 'custom-line-link':
                    updateCustomLineLink(item.value);
                    break;
                case 'show-big-white-wall-text':
                    bigWhiteWallText = true;
                    break;
                case 'show-social-media-icons':
                    showSocialMediaIcons = true;
                    break;
                case 'banner':
                    updateBanner(item.value);

                    if (item.value === 'standard-french-canadian') {
                        updateNoticeText('fr-ca');
                    } else {
                        updateNoticeText('en');
                    }
                    break;
                case 'locale':
                    updateLocale(item.value);
                    break;
            }

        });

        // Update checkboxes.
        updateBigWhiteWallText(bigWhiteWallText);
        updateSocialMediaIcons(showSocialMediaIcons);
    }

    /**
     * Function to initially show the 
     * email design in the preview box.
     * 
     * @param {*} form 
     */
    function showDesign() {
        $.get('designs/default.html', function (data) {
            var html = $(data);

            $('#sig-output').html(html);
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
        element.attr('href', 'mailto:' + address);
        element.attr('title', address);
    }

    /**
     * Update specific elements based on the region.
     *
     * @param {*} region 
     * @param {*} element 
     */
    function updateRegion(region, element) {
        output.find('#twitter-link').attr('href', regions[region]['twitter']);
        output.find('#linkedin-link').attr('href', regions[region]['linkedin']);
    }

    function updateCustomLineLink(link) {

        if (link === '') {
            output.find('#custom-line-link').removeAttr('href');
        } else {
            output.find('#custom-line-link').attr('href', link);
        }
    }

    function updateNoticeText(language) {
        $('#notice-text').html(noticeText[language]);
    }

    /**
     * Show or hide the Big White Wall text.
     * 
     * @param {*} value 
     */
    function updateBigWhiteWallText(value) {
        if (value) {
            output.find('[data-toggle="show-big-white-wall-text"]').show();
        } else {
            output.find('[data-toggle="show-big-white-wall-text"]').hide();
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
        output.find(`#banner`).attr('src', banners[value]['image']);
        output.find(`#banner`).attr('alt', banners[value]['alt']);
    }

    function updateLocale(value) {
        output.find('.website-link').attr('href', value);
    }

    /**
     * Generates a random number between 2 integers.
     * @param {number} min 
     * @param {number} max 
     * @returns 
     */
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    /**
     * Removes the table elements from the generated
     * signature if the form field is empty.
     */
    function removeUnusedFields() {

        // Any checkboxes need to be reset.
        let bigWhiteWallText = false;
        let showSocialMediaIcons = false;

        // Loop through the form data.
        form.serializeArray().forEach(function (item) {
            console.log(item);

            if (item.value === '') {
                $('#sig-output').find('.table-' + item.name).remove();
            }

            // Check for checkbox values below...
            if (item.name == 'show-big-white-wall-text') {
                bigWhiteWallText = true;
            }

            if (item.name == 'show-social-media-icons') {
                showSocialMediaIcons = true;
            }
        });

        // If the checkbox is not checked, remove the elements.
        if (!bigWhiteWallText) {
            $('#sig-output').find('.table-show-big-white-wall-text').remove();
        }

        if (!showSocialMediaIcons) {
            $('#sig-output').find('#socal-media').remove();
        }
    }

});
