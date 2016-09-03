<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Ajax extends CI_Controller {

    public $base_url = 'https://dochelpauth.azure-mobile.net/api/';
    public function specialities() {
        echo $this->curl->simple_get($this->base_url.'ProviderSpecialities');
    }

    public function cities() {
        echo $this->curl->simple_get($this->base_url.'Cities?state=WA');
    }
    
    public function search() {
        $this->load->model('search');
        $this->load->model('searchresults');
        echo $result = $this->search->search();
    }
    
    public function opensearch() {
        $this->load->model('search');
        $this->load->model('searchresults');
        echo $result = $this->search->opensearch();
    }
}
