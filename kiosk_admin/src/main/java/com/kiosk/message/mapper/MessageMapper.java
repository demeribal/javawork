package com.kiosk.message.mapper;

import com.kiosk.message.model.Message;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MessageMapper {
    Message getMessageById(int id);
    List<Message> getAllMessages();
    List<Message> getMessagesByPayId(int payId);
    List<Message> getMessagesByPhoneNumber(String phoneNumber);
    List<Message> getMessagesBySentStatus(boolean isSent);
    void insertMessage(Message message);
    void updateMessage(Message message);
    void updateMessageSentStatus(int id, boolean isSent);
    void deleteMessage(int id);
}
