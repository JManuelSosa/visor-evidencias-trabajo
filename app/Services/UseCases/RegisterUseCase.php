<?php
namespace App\Services\UseCases;

use App\Services\User\UserService;
use App\Services\User\PersonService;

use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Events\Registered;

class RegisterUseCase {

    public function __construct(
        private UserService $userService,
        private PersonService $personService
    ){}

    public function registerNewUser(array $data){

        return DB::transaction(function() use ($data){

            // 1. Creamos el usuario
            $dataNewUser = $this->userService->prepareForCreate($data);
            $newUser = $this->userService->createUser($dataNewUser);

            // 2. Inyectamos el id del nuevo usuario
            $data["user_id"] = $newUser->id;

            // 3. Creamos la persona asociada
            $dataNewPerson = $this->personService->prepareForCreate($data);
            $newPerson = $this->personService->createPerson($dataNewPerson);

            // 4. Disparamos el evento de correo
            event(new Registered($newUser));

            return (object) compact('newUser', 'newPerson');
        });

    }

}
