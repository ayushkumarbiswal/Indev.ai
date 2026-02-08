from langchain_community.tools.reddit_search.tool import RedditSearchRun
from langchain_community.utilities.reddit_search import RedditSearchAPIWrapper

class RetrieveStartupInfo:
    """ Tool to retrieve startup information from Outsources"""
    def __init__(self):
        self.reddit_search = RedditSearchRun()
        self.client_id = ""
        self.client_secret = ""
        self.user_agent = ""
    
    def retrieve_reddit_posts(self,query:str,limit:int = 5):
        """ Retrieve Reddit posts related to Given Query about Startups"""
        try:
            search = RedditSearchRun(
                api_wrapper=RedditSearchAPIWrapper(
                    reddit_client_id=self.client_id,
                    reddit_client_secret=self.client_secret,
                    reddit_user_agent=self.user_agent,
                )
            )
            result = search.run(tool_input=search_params.dict())
            return result
        except Exception as e:
            raise ValueError(f" :( Error in Retrieving Reddit posts: {e}")
        
        