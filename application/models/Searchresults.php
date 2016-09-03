<?php

class Searchresults extends CI_Model {

    public $seach_id;
    public $userID;
    public $prefix;
    public $credential;
    public $businessId;
    public $businessID1;
    public $fullName;
    public $firstName;
    public $lastName;
    public $email;
    public $contactNo;
    public $speciality_type;
    public $active;
    public $profile_status;
    public $address;
    public $state;
    public $city;
    public $city_id;
    public $postcode;
    public $gender;
    public $new_patient;
    public $online_appt;
    public $DisplaySpecialization;
    public $lat;
    public $lang;
    public $gpslocavailable;
    public $specialityName;
    public $profile_image;
    public $insurancePlans;
    public $PremierListingFlag;
    public $avgRating;
    public $reviewCount;
    public $fav_cnt;

    public function __construct() {
        // Call the CI_Model constructor
        parent::__construct();
    }

    public function get_records($search_id) {
        $query = $this->db->get_where('search_results', array('search_id' => $search_id));
        return $query->result_array();
    }

    public function insert_entries($providers, $search_id) {
        if (count($providers) > 0) {
            foreach ($providers as $key => $value) {
                $providers[$key]['search_id'] = $search_id;
            }
            $this->db->insert_batch('search_results', $providers);
        }
    }
    
    public function get_search_records($search_text) {
        $array = array(
            'firstName' => $search_text, 
            'lastName' => $search_text,
            'specialityName' => $search_text,
            'city' => $search_text,
            'state' => $search_text,
            );
        $this->db->or_like($array);
        $query = $this->db->get('search_results');
        return $query->result_array();
    }

}
