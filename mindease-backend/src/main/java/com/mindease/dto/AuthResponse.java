package com.mindease.dto;

import com.mindease.model.User;

public class AuthResponse {

    private String token;
    private UserDto user;

    public AuthResponse() {
    }

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getAge(), user.getAgeGroup(), user.getProfession(), user.getSettings());
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public static class UserDto {
        private String id;
        private String name;
        private String email;
        private Integer age;
        private String ageGroup;
        private String profession;
        private User.UserSettings settings;

        public UserDto() {
        }

        public UserDto(String id, String name, String email, User.UserSettings settings) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.settings = settings;
        }

        public UserDto(String id, String name, String email, Integer age, String ageGroup, String profession, User.UserSettings settings) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.age = age;
            this.ageGroup = ageGroup;
            this.profession = profession;
            this.settings = settings;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getAgeGroup() {
            return ageGroup;
        }

        public void setAgeGroup(String ageGroup) {
            this.ageGroup = ageGroup;
        }

        public String getProfession() {
            return profession;
        }

        public void setProfession(String profession) {
            this.profession = profession;
        }

        public User.UserSettings getSettings() {
            return settings;
        }

        public void setSettings(User.UserSettings settings) {
            this.settings = settings;
        }
    }
}
