package com.dlearn.engine.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String userid;
    private String prefixname;
    private String firstname;
    private String lastname;
    private String blood;
    private String nickname;
    private String position;
    private String Section;
    private String department;
    private String citizenid;
    private String retiredate;
    private String posiSname;
    private String cardId;
    private String posiName;
    private String lvl;
    private String org;
    private String picturepath;
    private String picturethumb;
    private String posiNameGover;
    private String orgaGover;
    private String changeDate;
}
