<?php

class Search extends CI_Model {

    public $city_id;
    public $state_id;
    public $speciality_id;

    public function __construct() {
        // Call the CI_Model constructor
        parent::__construct();
    }

    private function get_record() {
        return $query = $this->db->get_where('search', array('city_id' => $this->city_id, 'state_id' => $this->state_id, 'speciality_id' => $this->speciality_id));
    }

    public function insert_entry() {
        $this->title = $_POST['title']; // please read the below note
        $this->content = $_POST['content'];
        $this->date = time();

        $this->db->insert('entries', $this);
    }

    public function update_entry() {
        $this->title = $_POST['title'];
        $this->content = $_POST['content'];
        $this->date = time();

        $this->db->update('entries', $this, array('id' => $_POST['id']));
    }

    public function search() {
        $this->city_id = $_POST['city_id'];
        $this->state_id = $_POST['state_id'];
        $this->speciality_id = $_POST['speciality_id'];

        $record = $this->get_record();
        if ($record->num_rows() > 0) {
            //get search id
            $row = $record->row();
            $search_id = $row->id;
            $results_arr = $this->searchresults->get_records($search_id);
            return json_encode(['Providers' => $results_arr]);
        } else {
            //insert search record
            $this->db->insert('search', $this);
            $search_id = $this->db->insert_id();
            //call API
            $response = $this->curl->simple_get($this->base_url . 'Providers?CityId=' . $this->city_id . '&State=' . $this->state_id . '&SpecialityId=' . $this->speciality_id);
            $response_arr = json_decode($response, true);
            $this->searchresults->insert_entries($response_arr['Providers'], $search_id);
            return $response;
        }
    }

}
