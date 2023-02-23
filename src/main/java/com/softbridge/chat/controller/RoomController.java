package com.softbridge.chat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RoomController {

    @GetMapping("/sendbird/room01")
    public String sendbird01() {
        return "roomtype01";
    }

    @GetMapping("/sendbird/room02")
    public String sendbird02() {
        return "roomtype02";
    }

    @GetMapping("/sendbird/room03")
    public String sendbird03() {
        return "roomtype03";
    }

    @GetMapping("/talkplus/room01")
    public String talkplus01() {
        return "roomtype01";
    }

    @GetMapping("/talkplus/room02")
    public String talkplus02() {
        return "roomtype02";
    }

    @GetMapping("/talkplus/room03")
    public String talkplus03() {
        return "roomtype03";
    }
}
