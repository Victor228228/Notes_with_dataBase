<?php
$_POST = json_decode(file_get_contents("php://input"), true); // декодируем  JSON файл, если отправляем как JSON, а не в обычном формате через объект new FormData
echo var_dump($_POST);
