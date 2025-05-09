package com.kiosk.message.controller;

import com.kiosk.message.model.Message;
import com.kiosk.message.service.MessageService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable("id") int id) {
        Message message = messageService.getMessageById(id);
        if (message != null) {
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
    
    @GetMapping("/payment/{payId}")
    public ResponseEntity<List<Message>> getMessagesByPayId(@PathVariable("payId") int payId) {
        List<Message> messages = messageService.getMessagesByPayId(payId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
    
    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<List<Message>> getMessagesByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
        List<Message> messages = messageService.getMessagesByPhoneNumber(phoneNumber);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
    
    @GetMapping("/status/{isSent}")
    public ResponseEntity<List<Message>> getMessagesBySentStatus(@PathVariable("isSent") boolean isSent) {
        List<Message> messages = messageService.getMessagesBySentStatus(isSent);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Void> addMessage(@RequestBody Message message) {
        messageService.addMessage(message);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateMessage(@PathVariable("id") int id, @RequestBody Message message) {
        message.setId(id);
        messageService.updateMessage(message);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PutMapping("/{id}/status/{isSent}")
    public ResponseEntity<Void> updateMessageSentStatus(@PathVariable("id") int id, @PathVariable("isSent") boolean isSent) {
        messageService.updateMessageSentStatus(id, isSent);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable("id") int id) {
        messageService.deleteMessage(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
