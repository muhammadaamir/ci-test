CISearch = function ()
{
    // Private members
    var that = this;
    var _ajax = 0;
    var base_url = window.location.origin;
    var ajax_base_url = base_url + '/ajax';
    var speciality = '#speciality';
    var city = '#city';
    var search_button = '#go';
    var search_results_div = '.search_results';
    var result_displayed = 0;
    var search_results;
    var original_search_results;
    var sort_order = 'desc';
    /**
     * Constructor
     * 
     * @access public
     * @return null
     */
    that.init = function ()
    {
        _bindEvents();
    };

    that.initFillDropdowns = function ()
    {
        _initGetSpeciality();
        _initGetCity();
    };

    function _initGetSpeciality() {
        $.ajax({
            type: "GET",
            url: ajax_base_url + '/specialities',
            beforeSend: function () {
                //do nothing
            },
            success: function (response) {
                $(speciality).find(':first-child').remove();
                $(speciality).prepend('<option value="">Select Speciality</option>');
                response = JSON.parse(response);

                $(response.Specialities).each(function () {
                    var option = $('<option />');
                    option.attr('value', this.SpecialityID).text(this.SpecialityName);
                    $(speciality).append(option);
                });

            },
            error: function (response) {
                alert("Error :" + response);
            },
        });
    }

    function _initGetCity() {
        $.ajax({
            type: "GET",
            url: ajax_base_url + '/cities',
            beforeSend: function () {
                //do nothing
            },
            success: function (response) {
                response = JSON.parse(response);
                $(city).find(':first-child').remove();
                $(city).prepend('<option value="">Select City, State</option>');
                $(response.Cities).each(function () {
                    var option = $('<option />');
                    option.attr('value', this.city_id).attr('state_id', this.state_id).text(this.city_name + ", " + this.state_id);
                    $(city).append(option);
                });
            },
            error: function (response) {
                alert("Error :" + response);
            },
        });
    }

    function _displayResults() {
        //debugger;
        $(search_results).each(function () {

            var image = base_url + '/assets/img/icon_no_logo.gif';
            if (typeof this.profile_image !== 'undefined') {
                if (this.profile_image.length) {
                    image = this.profile_image;
                }
            }
            //if(typeof this.firstName !== 'undefined' )
            var search_result = '<div class="media"><div class="media-left">' +
                    '<img class="media-object" src="' + image + '">' +
                    '</div>' +
                    '<div class="media-body">' +
                    '<h4 class="media-heading">' + this.firstName + ' ' + this.lastName + '</h4>' +
                    this.specialityName + '<br />' +
                    this.city + ', ' + this.state + ', ' + this.postcode + '<br />' +
                    '</div>' +
                    '</div>';
            $(search_results_div).append(search_result);
            search_results.shift();
            result_displayed++;
            if (result_displayed % 5 == 0) {
                $(search_results_div).append('<button id="load-more">more</button>');
                return false;
            }


        });
    }
    
    //http://stackoverflow.com/questions/881510/sorting-json-by-values
    function sortResults(prop, order) {
        search_results = JSON.parse(JSON.stringify(original_search_results));
    search_results = search_results.sort(function(a, b) {
        if (order == 'asc') {
            sort_order = 'desc';
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            sort_order = 'asc';
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    
}
    function _bindEvents() {
        
        $(document).on('click', search_button, function () {
            var total_results = 0;
            var city_id = $(city).val();
            var state_id = $(city + " option:selected").attr("state_id");
            var speciality_id = $(speciality).val();
            var error = false;
            var error_details = [];
            result_displayed = 0;
            search_results = '';
            sort_order = 'desc';
            original_search_results = '';
            if (city_id === '') {
                error_details.push('Please select city');
                error = true;
            }
            if (speciality_id === '') {
                error_details.push('Please select state');
                error = true;
            }
            if (error) {
                alert(error_details);
                return false;
            }
            var data = {
                'city_id': city_id,
                'state_id': state_id,
                'speciality_id': speciality_id

            };
            $.ajax({
                type: "POST",
                url: ajax_base_url + '/search',
                data: data,
                beforeSend: function () {
                    $(search_results_div).html('Searching');
                },
                success: function (response) {
                    response = JSON.parse(response);
                    total_results = response.Providers.length;
                    search_results = response.Providers;
                    original_search_results = JSON.parse(JSON.stringify(search_results));
                    if (total_results == 0)
                        $(search_results_div).html('No record found.');
                    else {
                        $(search_results_div).html('');
                        _displayResults();

                    }
                }
            });
        });

        $(document).on('click', '#load-more', function () {
            $(this).remove();
            _displayResults();
        });
        
        $(document).on('click', '#sort', function () {
            sortResults('firstName', sort_order);
            $(search_results_div).html('');
            _displayResults();
        });
        
        $(document).on('click', '#open_search', function () {
            var data = {
                'open_search_text': $('#open_search_text').val()

            };
            
            $.ajax({
                type: "POST",
                url: ajax_base_url + '/opensearch',
                data: data,
                beforeSend: function () {
                    $(search_results_div).html('Searching');
                },
                success: function (response) {
                    response = JSON.parse(response);
                    total_results = response.Providers.length;
                    search_results = response.Providers;
                    if (total_results == 0)
                        $(search_results_div).html('No record found.');
                    else {
                        $(search_results_div).html('');
                        _displayResults();
                    }
                }
            });
           
        });
        
        $("#open_search_text").keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                $("#open_search").click();
            }
        });
    }


};

objCISearch = new CISearch();
$(document).ready(function () {
    objCISearch.init();
    objCISearch.initFillDropdowns();

});