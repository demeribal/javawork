package com.kiosk.message.service;

import com.kiosk.message.mapper.MessageMapper;
import com.kiosk.message.model.Message;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    
    @Autowired
    private MessageMapper messageMapper;
    
    public Message getMessageById(int id) {
        return messageMapper.getMessageById(id);
    }
    
    public List<Message> getAllMessages() {
        return messageMapper.getAllMessages();
    }
    
    public List<Message> getMessagesByPayId(int payId) {
        return messageMapper.getMessagesByPayId(payId);
    }
    
    public List<Message> getMessagesByPhoneNumber(String phoneNumber) {
        return messageMapper.getMessagesByPhoneNumber(phoneNumber);
    }
    
    public List<Message> getMessagesBySentStatus(boolean isSent) {
        return messageMapper.getMessagesBySentStatus(isSent);
    }
    
    public void addMessage(Message message) {
        messageMapper.insertMessage(message);
    }
    
    public void updateMessage(Message message) {
        messageMapper.updateMessage(message);
    }
    
    public void updateMessageSentStatus(int id, boolean isSent) {
        messageMapper.updateMessageSentStatus(id, isSent);
    }
    
    public void deleteMessage(int id) {
        messageMapper.deleteMessage(id);
    }
}
