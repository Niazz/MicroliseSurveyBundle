<?php

namespace Microlise\SurveyBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Question
 *
 * @ORM\Table(name="question")
 * @ORM\Entity
 */
class Question
{
    //

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $question;

    /**
     * @ORM\ManyToOne(targetEntity="Survey", inversedBy="questions")
     * @ORM\JoinColumn(name="survey_id", referencedColumnName="id")
     **/
    private $surveyid;


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * @param mixed $question
     */
    public function setQuestion($question)
    {
        $this->question = $question;
    }



    /**
     * @return mixed
     */
    public function getSurveyid()
    {
        return $this->surveyid;
    }

    /**
     * @param mixed $surveyid
     */
    public function setSurveyid($surveyid)
    {
        $this->surveyid = $surveyid;
    }





}
