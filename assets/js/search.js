CISearch = function ()
{
    // Private members
    var that = this;
    var _ajax = 0;
    var ajax_base_url = window.location.origin+'/ajax';
    var speciality = '#speciality';
    var city = '#city';
    var search_button = '#go';
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
                url: ajax_base_url+'/specialities',
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
                    alert("Error :"+response);
                },
            });
    }

    function _initGetCity() {
            $.ajax({
                type: "GET",
                url: ajax_base_url+'/cities',
                beforeSend: function () {
                    //do nothing
                },
                success: function (response) {
                    response = JSON.parse(response);
                    $(city).find(':first-child').remove();
                    $(city).prepend('<option value="">Select City, State</option>');
                    $(response.Cities).each(function () {
                        var option = $('<option />');
                        option.attr('value', this.city_id).attr('state_id',this.state_id).text(this.city_name + ", " + this.state_id );
                        $(city).append(option);
                    });
                },
                error: function (response) {
                    alert("Error :"+response);
                },
            });
    }
    function _bindEvents() {
        //Bookmark
        $(document).on('click', search_button, function () {
            var city_id = $(city).val();
            var state_id = $(city+" option:selected").attr("state_id");
            var speciality_id = $(speciality).val();
            var error = false;
            var error_details = [];
            if(city_id === '') {
                error_details.push('Please select city');
                    error=true;
            }
            if(speciality_id === '') {
                error_details.push('Please select state');
                error=true;
            }
            if(error) {
                alert(error_details);
                return false;
            }
            var data = {
                'city_id' : city_id,
                'state_id' : state_id,
                'speciality_id': speciality_id
                
            };
            $.ajax({
                type: "POST",
                url: ajax_base_url+'/search',
                data: data,
                beforeSend: function (msg) {

                },
                success: function (response) {
                    console.log(response);
                }
            });
        });
    }

   
};

objCISearch= new CISearch();
$(document).ready(function () {
    objCISearch.init();
    objCISearch.initFillDropdowns();

});

function callBackFunction(json){
    alert("AAA");
  console.log(json);
}