package KOMBAT.controllers;


import gamestate.Bot;
import gamestate.Player;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ModeController {

    @PostMapping("/mode")
    public void ModeSelection (@RequestBody String mode) {
        Player player1;
        Player player2;
        if(mode.equals("PvsP")) {
            player1=new Player();
            player2=new Player();
        }
        else if(mode.equals("PvsB")) {
            player1=new Player();
            player2=new Bot();
        }
        else {
            player1=new Bot();
            player2=new Bot();
        }
    }

}
