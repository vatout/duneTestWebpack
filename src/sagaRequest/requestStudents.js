import axios from "axios";

export function requestStudentsFromClassroom(classroomid, updateHandler) {
    axios.post("http://176.31.252.134:7001/api/v1/eleves/byClasse/", {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            idClasse:classroomid,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDI5ODY0NzYsImV4cCI6MTg1ODM0NjQ3Nn0.1-AzcidDuMfnI9c36ZX2Kp_SpU0fwwh1AtX2LNkALQk'
    }).then(function (response, ) {
        if (response == null || response.data == null || response.data.error != null)
            return;
        updateHandler(response.data.response.map(value => {
            return (
                {
                    id:value.idEleve,
                    name:value.nomEleve,
                    firstname:value.prenomEleve,
                    profilePicture: value.picPath,
                }
            );
        }));
    });
}