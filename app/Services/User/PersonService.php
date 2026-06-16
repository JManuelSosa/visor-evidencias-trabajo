<?php
namespace App\Services\User;

use App\Models\Person;

class PersonService {

    public function createPerson(array $data):Person {
        return Person::create($data);
    }

    public function prepareForCreate(array $data):array {
        return [
            "name" => $data['name'],
            "paternal_last_name" => $data['paternal_last_name'],
            "maternal_last_name" => $data['maternal_last_name'] ?? null,
            "phone" => $data['phone'] ?? null,
            "photo_id" => null,
            "user_id" => $data["user_id"]
        ];
    }

}
