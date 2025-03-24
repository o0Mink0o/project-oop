package KOMBAT.controllers;

import KOMBAT.models.PlayerConfig;
import gamestate.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PlayerConfigController {

    @PostMapping("/minion-types")
    public ResponseEntity<Map<String, String>> addMinionTypes(@RequestBody List<PlayerConfig> minions) {
        for (PlayerConfig minion : minions) {
            String name = minion.getName();
            String defense = minion.getDefense();
            String strategy = minion.getStrategy();

            // Create Strategy from string
            Strategy parsedStrategy = ReadStrategy.safeParse(strategy);
            System.out.println("Minion Type: " + name + " Def: " + defense + " Strategy: " + parsedStrategy);

            // Add to minion map
            MinionType newMinionType = new MinionType(name, Integer.parseInt(defense), parsedStrategy);
            Minion.minionTypeMap.put(name, newMinionType);
            System.out.println(Minion.minionTypeMap.keySet());
            System.out.println("New Minion type added: " + name);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Minion types created successfully!");
        return ResponseEntity.ok(response);
    }

}