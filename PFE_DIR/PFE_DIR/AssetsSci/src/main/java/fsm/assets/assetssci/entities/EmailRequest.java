package fsm.assets.assetssci.entities;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Getter
@Setter
public class EmailRequest {
    private String to;
    private String subject;
    private String body;

}
